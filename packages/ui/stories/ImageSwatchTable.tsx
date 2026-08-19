import type { CSSProperties } from 'react';

export type ImageAsset = {
  /** Display name, e.g. "Google Drive" */
  name: string;
  /** Record key in the source module, e.g. "google-drive" */
  key: string;
  /** Resolved asset URL */
  src: string;
  /** Underlying file, e.g. "google-drive.png" */
  file: string;
};

const cellStyle: CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  verticalAlign: 'middle',
};

/** Checkerboard backdrop — reads transparency the same way design tools do. */
const CHECKERBOARD: CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg, var(--border) 25%, transparent 25%), ' +
    'linear-gradient(-45deg, var(--border) 25%, transparent 25%), ' +
    'linear-gradient(45deg, transparent 75%, var(--border) 75%), ' +
    'linear-gradient(-45deg, transparent 75%, var(--border) 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
};

function Row({ asset, importPath }: { asset: ImageAsset; importPath: string }) {
  return (
    <tr>
      <td style={{ ...cellStyle, padding: '16px 12px' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            ...CHECKERBOARD,
          }}
        >
          <img src={asset.src} alt={asset.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
        </div>
      </td>
      <td style={{ ...cellStyle, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{asset.name}</td>
      <td style={cellStyle}>{`BRAND_LOGOS['${asset.key}']`}</td>
      <td style={cellStyle}>{importPath}</td>
      <td style={{ ...cellStyle, opacity: 0.75 }}>{asset.file}</td>
    </tr>
  );
}

export function ImageSwatchTable({ assets, importPath }: { assets: ImageAsset[]; importPath: string }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Name</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Key</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Import</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>File</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <Row key={asset.key} asset={asset} importPath={importPath} />
        ))}
      </tbody>
    </table>
  );
}
