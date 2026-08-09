import { describe, it, expect, vi } from 'vitest';
import { MediaClient, initialize } from '../src/client';

describe('MediaClient', () => {
  it('initializes with default config and provides fluent searchPhotos API', async () => {
    const client = initialize({ mockMode: true, enableLogging: false });
    const response = await client.searchPhotos({ query: 'nature', page: 1, per_page: 5 });

    expect(response).toBeDefined();
    expect(response.page).toBe(1);
    expect(response.per_page).toBe(5);
    expect(response.items.length).toBe(5);
    expect(response.items[0].type).toBe('photo');
    expect(response.items[0].src.original).toBeDefined();
  });

  it('searches videos in mock mode', async () => {
    const client = new MediaClient({ mockMode: true, enableLogging: false });
    const response = await client.searchVideos({ query: 'ocean', page: 1, per_page: 3 });

    expect(response).toBeDefined();
    expect(response.items.length).toBe(3);
    expect(response.items[0].type).toBe('video');
    expect(response.items[0].video_files.length).toBeGreaterThan(0);
  });

  it('fetches curated photos with caching', async () => {
    const client = new MediaClient({ mockMode: true, enableLogging: false });
    const response1 = await client.getCurated({ page: 1, per_page: 4 });
    const response2 = await client.getCurated({ page: 1, per_page: 4 });

    expect(response1).toEqual(response2);
    const stats = client.getCacheStats();
    expect(stats.hits).toBe(1);
  });

  it('records view and download events correctly', () => {
    const client = new MediaClient({ mockMode: true, enableLogging: false });
    const viewSpy = vi.fn();
    const downloadSpy = vi.fn();

    client.on('view', viewSpy);
    client.on('download', downloadSpy);

    const mockItem: any = { id: 99, type: 'photo' };
    client.recordView(mockItem);
    client.recordDownload(mockItem, 'large');

    expect(viewSpy).toHaveBeenCalledWith(expect.objectContaining({ item: mockItem }));
    expect(downloadSpy).toHaveBeenCalledWith(expect.objectContaining({ item: mockItem, format: 'large' }));
  });
});
