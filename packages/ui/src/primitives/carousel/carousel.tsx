/**
 * Fabely Carousel primitive — Embla track with Foundations spacing and
 * Fabely Icon Button chrome for Previous / Next.
 *
 * API ground truth: [shadcn Carousel](https://ui.shadcn.com/docs/components/base/carousel)
 * + [Embla](https://www.embla-carousel.com/). Figma Card page set
 * (`164:18293`) — slide gap `md` (16), nav = Icon Button Outline Round Default.
 *
 * Vendor file (`src/components/ui/carousel.tsx`) stays untouched. Import from
 * this primitive.
 */
'use client';

import * as React from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  IconButton,
  type IconButtonProps,
} from '../button/icon-button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

/** Nav offset: Icon Button default (36) + slide gap (`--carousel-spacing`). */
const NAV_OUTSET =
  '-start-[calc(var(--spacing-9)+var(--carousel-spacing))]';
const NAV_OUTSET_END =
  '-end-[calc(var(--spacing-9)+var(--carousel-spacing))]';

/**
 * Embla scroll duration (not ms — engine units; default 25). Lower settles
 * sooner so the ease-out tail feels less draggy. Override via `opts.duration`.
 */
const DEFAULT_SCROLL_DURATION = 18;

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      duration: DEFAULT_SCROLL_DURATION,
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn(
          'relative',
          /* Figma slide gap — override with [--carousel-spacing:var(--spacing-*)] */
          '[--carousel-spacing:var(--spacing-md)]',
          className
        )}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'flex',
          orientation === 'horizontal'
            ? '-ms-[length:var(--carousel-spacing)]'
            : '-mt-[length:var(--carousel-spacing)] flex-col',
          className
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal'
          ? 'ps-[length:var(--carousel-spacing)]'
          : 'pt-[length:var(--carousel-spacing)]',
        className
      )}
      {...props}
    />
  );
}

type CarouselNavButtonProps = Omit<IconButtonProps, 'aria-label' | 'children'> & {
  'aria-label'?: string;
};

function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'default',
  roundness = 'round',
  'aria-label': ariaLabel = 'Previous slide',
  ...props
}: CarouselNavButtonProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <IconButton
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      roundness={roundness}
      aria-label={ariaLabel}
      className={cn(
        'absolute touch-manipulation',
        orientation === 'horizontal'
          ? cn('inset-y-0 my-auto rtl:rotate-180', NAV_OUTSET)
          : '-top-[calc(var(--spacing-9)+var(--carousel-spacing))] left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon />
    </IconButton>
  );
}

function CarouselNext({
  className,
  variant = 'outline',
  size = 'default',
  roundness = 'round',
  'aria-label': ariaLabel = 'Next slide',
  ...props
}: CarouselNavButtonProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <IconButton
      data-slot="carousel-next"
      variant={variant}
      size={size}
      roundness={roundness}
      aria-label={ariaLabel}
      className={cn(
        'absolute touch-manipulation',
        orientation === 'horizontal'
          ? cn('inset-y-0 my-auto rtl:rotate-180', NAV_OUTSET_END)
          : '-bottom-[calc(var(--spacing-9)+var(--carousel-spacing))] left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon />
    </IconButton>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
export type { CarouselProps, CarouselNavButtonProps };
