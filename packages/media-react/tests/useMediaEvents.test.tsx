import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { MediaProvider, useMediaEvents } from '../src';

const EventTestComponent = ({ onViewCb }: { onViewCb: (payload: any) => void }) => {
  const { recordView, recordDownload } = useMediaEvents({
    onView: onViewCb,
  });

  return (
    <div>
      <button
        data-testid="emit-view"
        onClick={() => recordView({ id: 555, type: 'photo' } as any)}
      >
        Trigger View
      </button>
      <button
        data-testid="emit-download"
        onClick={() => recordDownload({ id: 555, type: 'photo' } as any, 'large')}
      >
        Trigger Download
      </button>
    </div>
  );
};

describe('useMediaEvents', () => {
  it('subscribes and fires event callbacks via MediaProvider client', () => {
    const viewSpy = vi.fn();

    render(
      <MediaProvider config={{ mockMode: true, enableLogging: false }}>
        <EventTestComponent onViewCb={viewSpy} />
      </MediaProvider>
    );

    fireEvent.click(screen.getByTestId('emit-view'));
    expect(viewSpy).toHaveBeenCalledTimes(1);
    expect(viewSpy).toHaveBeenCalledWith(expect.objectContaining({
      item: expect.objectContaining({ id: 555 }),
    }));
  });
});
