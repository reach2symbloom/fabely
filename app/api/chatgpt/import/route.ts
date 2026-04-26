import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

/**
 * Enhanced recursive reader. 
 * Uses path.resolve to ensure we are looking at the actual project root.
 */
function getWorkspaceContents(dir: string, fileList: any[] = []) {
  try {
    if (!fs.existsSync(dir)) return fileList;

    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      
      // Expanded exclusion list to speed up scanning
      const excluded = ['node_modules', '.next', '.git', 'dist', 'out', '.vercel', 'public', 'package-lock.json'];
      if (excluded.includes(file) || file.startsWith('.')) return;

      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        getWorkspaceContents(filePath, fileList);
      } else {
        const ext = path.extname(file).toLowerCase();
        const allowedExts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.txt', '.md', '.css', '.py'];
        
        if (allowedExts.includes(ext)) {
          const content = fs.readFileSync(filePath, 'utf8');
          fileList.push({
            id: `local-${Math.random().toString(36).substring(2, 11)}`,
            title: file,
            path: filePath.split(process.cwd())[1] || file, 
            summary: `Local workspace file: ${file}`,
            content: content.substring(0, 5000), // Cap content size for safety
            created_at: new Date().toISOString(),
            source: 'local-workspace'
          });
        }
      }
    });
  } catch (err) {
    console.error('Error reading directory:', dir, err);
  }
  return fileList;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, apiKey } = body;

    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY1;
    
    // 1. IMPROVED LOCAL SCAN
    // We use path.resolve('.') to get the absolute path of the execution context
    const rootPath = path.resolve('.');
    const workspaceFiles = getWorkspaceContents(rootPath);

    // 2. FETCH OPENAI DATA
    let remoteItems: any[] = [];
    let sourceStatus = 'local-only';

    if (openaiApiKey) {
      const openai = new OpenAI({ apiKey: openaiApiKey });

      try {
        // A. Fetch OpenAI "Projects" (Enterprise/Team feature)
        const projects = await openai.projects.list();
        projects.data.forEach((p: any) => {
          remoteItems.push({
            id: p.id,
            title: `Project: ${p.name}`,
            summary: `OpenAI Project (${p.status})`,
            content: `Project ID: ${p.id} | Org: ${p.organization_id}`,
            created_at: new Date(p.created_at * 1000).toISOString(),
            source: 'openai-project'
          });
        });

        // B. Fetch OpenAI Files (Files uploaded for Assistants/Fine-tuning)
        const files = await openai.files.list();
        files.data.forEach((f: any) => {
          remoteItems.push({
            id: f.id,
            title: `Cloud File: ${f.filename}`,
            summary: `OpenAI Uploaded File (${f.purpose})`,
            content: `File ID: ${f.id} | Size: ${f.bytes} bytes`,
            created_at: new Date(f.created_at * 1000).toISOString(),
            source: 'openai-cloud-storage'
          });
        });

        sourceStatus = 'hybrid-workspace';
      } catch (apiErr: any) {
        console.warn('OpenAI API fetch partial failure:', apiErr.message);
      }
    }

    // 3. COMBINE AND RESPOND
    const finalConversations = [
      {
        id: 'system-manifest',
        title: '📂 Integration Results',
        summary: `Successfully imported ${workspaceFiles.length} local files and ${remoteItems.length} OpenAI objects.`,
        created_at: new Date().toISOString(),
        source: 'system'
      },
      ...workspaceFiles,
      ...remoteItems
    ];

    return NextResponse.json({
      success: true,
      count: finalConversations.length,
      conversations: finalConversations,
      source: sourceStatus
    });

  } catch (error: any) {
    console.error('Final API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
