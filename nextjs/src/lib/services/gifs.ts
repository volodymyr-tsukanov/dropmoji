/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { IGifRecord } from "../consts";
import { config } from "../config";


abstract class GifProvider {
  public static readonly baseUrl: string;
  public static readonly serviceLetter: string;

  /** @returns bunch of gifs related to query */
  public static async search(query: string): Promise<IGifRecord[]> {
    throw new Error('Method not implemented');
  }

  /** Find exact gif by _GifRecord.id_ */
  public static async find(gifId: string): Promise<IGifRecord | null> {
    throw new Error('Method not implemented');
  }

  public static async ping(): Promise<boolean> {
    throw new Error('Method not implemented');
  }

  protected static extractIdFromGifId(gifId: string, serviceLetter: string): string {
    const prefix = `g${serviceLetter}-`;
    return gifId.startsWith(prefix) ? gifId.slice(prefix.length) : gifId;
  }

  protected static createGifId(originalId: string, serviceLetter: string): string {
    return `g${serviceLetter}-${originalId}`;
  }
}


/*class GiphyGifProvider extends GifProvider {
  public static readonly baseUrl = 'https://api.giphy.com/v1/gifs';
  public static readonly serviceLetter = 'p';
  private static readonly apiKey = config.providers.tenor;

  public static async search(query: string, limit: number = 20): Promise<IGifRecord[]> {
    try {
      const searchUrl = `${this.baseUrl}/search?api_key=${this.apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&rating=pg-13`;

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status}`);
      }

      const data = await response.json();

      return data.data.map((gif: any) => ({
        id: this.createGifId(gif.id, this.serviceLetter),
        url: gif.images.fixed_height.url,
        previewUrl: gif.images.fixed_height_small.url,
        title: gif.title,
        width: parseInt(gif.images.fixed_height.width),
        height: parseInt(gif.images.fixed_height.height),
      } as IGifRecord));
    } catch (error) {
      console.error('Giphy search error:', error);
      return [];
    }
  }

  public static async find(gifId: string): Promise<IGifRecord | null> {
    try {
      const originalId = this.extractIdFromGifId(gifId, this.serviceLetter);
      const findUrl = `${this.baseUrl}/${originalId}?api_key=${this.apiKey}`;

      const response = await fetch(findUrl);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const gif = data.data;

      return {
        id: gifId,
        url: gif.images.fixed_height.url,
        previewUrl: gif.images.fixed_height_small.url,
        title: gif.title,
        width: parseInt(gif.images.fixed_height.width),
        height: parseInt(gif.images.fixed_height.height),
      } as IGifRecord;
    } catch (error) {
      console.error('Giphy find error:', error);
      return null;
    }
  }

  public static async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/trending?api_key=${this.apiKey}&limit=1`);
      return response.ok;
    } catch {
      return false;
    }
  }

  public static async trending(limit: number = 20): Promise<IGifRecord[]> {
    try {
      const trendingUrl = `${this.baseUrl}/trending?api_key=${this.apiKey}&limit=${limit}&rating=pg-13`;

      const response = await fetch(trendingUrl);
      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status}`);
      }

      const data = await response.json();

      return data.data.map((gif: any) => ({
        id: this.createGifId(gif.id, this.serviceLetter),
        url: gif.images.fixed_height.url,
        previewUrl: gif.images.fixed_height_small.url,
        title: gif.title,
        width: parseInt(gif.images.fixed_height.width),
        height: parseInt(gif.images.fixed_height.height),
      } as IGifRecord));
    } catch (error) {
      console.error('Giphy trending error:', error);
      return [];
    }
  }
}*/

interface ITenorGif {
  id: string;
  title: string;
  /** formats: `gif|mediumgif|tinygif|nanogif|mp4|webm` \
   * example structure:
   * ```ts
tinygif: {
  url: '',
  duration: 0.7,
  preview: '',
  dims: [ 220, 296 ],
  size: 132770
}
   * ```
   */
  media_formats: any;
  created: number;
  content_description: string;
  /** the full URL to view the post on tenor.com */
  itemurl: string;
  /** short url to the post */
  url: string;
  tags: string[];
  flags: any[];
  hasaudio: boolean;
  content_description_source: string;
}
class TenorGifProvider extends GifProvider {
  public static readonly baseUrl = 'https://tenor.googleapis.com/v2';
  public static readonly serviceLetter = 't';
  private static readonly apiKey = config.providers.tenor;
  private static readonly defaultParams = 'contentfilter=off&random=true';

  public static async search(query: string, limit: number = 20): Promise<IGifRecord[]> {
    try {
      if (!this.apiKey) {
        console.warn('Tenor API key not configured');
        return [];
      }

      const searchUrl = `${this.baseUrl}/search?key=${this.apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&${this.defaultParams}&media_filter=tinygif`;

      const response = await fetch(searchUrl);
      if (!response.ok)
        throw new Error(`Tenor API error: ${response.status}`);
      const { locale, results, next }: { locale: string, results: ITenorGif[], next: string } = await response.json();

      return results.map((gif) => ({
        id: this.createGifId(gif.id, this.serviceLetter),
        url: gif.url,
        previewUrl: gif.media_formats.tinygif.url,
        title: gif.content_description,
      } as IGifRecord));
    } catch (error) {
      console.error('Tenor search error:', error);
      return [];
    }
  }

  public static async find(gifId: string): Promise<IGifRecord | null> {
    try {
      if (!this.apiKey) {
        console.warn('Tenor API key not configured');
        return null;
      }

      const originalId = this.extractIdFromGifId(gifId, this.serviceLetter);
      const findUrl = `${this.baseUrl}/posts?key=${this.apiKey}&ids=${originalId}&media_filter=gif`;

      const response = await fetch(findUrl);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        return null;
      }
      const gif = data.results[0] as ITenorGif;
      return {
        id: gifId,
        url: gif.itemurl,
        previewUrl: gif.media_formats.gif.url,
        title: gif.content_description,
        width: gif.media_formats.gif.dims[0],
        height: gif.media_formats.gif.dims[1],
      } as IGifRecord;
    } catch (error) {
      console.error('Tenor find error:', error);
      return null;
    }
  }

  public static async ping(): Promise<boolean> {
    try {
      if (!this.apiKey) return false;
      const response = await fetch(`${this.baseUrl}/featured?key=${this.apiKey}&limit=1`);
      return response.ok;
    } catch {
      return false;
    }
  }

  public static async trending(limit: number = 20): Promise<IGifRecord[]> {
    try {
      if (!this.apiKey) {
        console.warn('Tenor API key not configured');
        return [];
      }

      const trendingUrl = `${this.baseUrl}/featured?key=${this.apiKey}&limit=${limit}&${this.defaultParams}&media_filter=tinygif`;
      const response = await fetch(trendingUrl);
      if (!response.ok)
        throw new Error(`Tenor API error: ${response.status}`);
      const { locale, results, next }: { locale: string, results: ITenorGif[], next: string } = await response.json();

      return results.map((gif) => ({
        id: this.createGifId(gif.id, this.serviceLetter),
        url: gif.itemurl,
        previewUrl: gif.media_formats.tinygif.url,
        title: gif.content_description,
      } as IGifRecord));
    } catch (error) {
      console.error('Tenor trending error:', error);
      return [];
    }
  }
}



export class GifService {
  private static providers = [/*GiphyGifProvider,*/ TenorGifProvider];

  public static async search(query: string, limit: number = 20): Promise<IGifRecord[]> {
    const results: IGifRecord[] = [];
    const limitPerProvider = Math.ceil(limit / this.providers.length);

    const searchPromises = this.providers.map(async (Provider) => {
      try {
        return await Provider.search(query, limitPerProvider);
      } catch (error) {
        console.error(`${Provider.name} search failed:`, error);
        return [];
      }
    });

    const providerResults = await Promise.all(searchPromises);

    // Interleave results from different providers
    const maxLength = Math.max(...providerResults.map(arr => arr.length));
    for (let i = 0; i < maxLength && results.length < limit; i++) {
      for (const providerResult of providerResults) {
        if (i < providerResult.length && results.length < limit) {
          results.push(providerResult[i]);
        }
      }
    }

    return results;
  }

  public static async find(gifId: string): Promise<IGifRecord | null> {
    const serviceLetter = this.extractServiceLetter(gifId);
    const provider = this.getProviderByServiceLetter(serviceLetter);

    if (!provider) {
      console.error(`Unknown service letter: ${serviceLetter}`);
      return null;
    }

    return await provider.find(gifId);
  }

  public static async trending(limit: number = 20): Promise<IGifRecord[]> {
    const results: IGifRecord[] = [];
    const limitPerProvider = Math.ceil(limit / this.providers.length);

    const trendingPromises = this.providers.map(async (Provider) => {
      try {
        return await Provider.trending(limitPerProvider);
      } catch (error) {
        console.error(`${Provider.name} trending failed:`, error);
        return [];
      }
    });

    const providerResults = await Promise.all(trendingPromises);

    // Interleave results from different providers
    const maxLength = Math.max(...providerResults.map(arr => arr.length));
    for (let i = 0; i < maxLength && results.length < limit; i++) {
      for (const providerResult of providerResults) {
        if (i < providerResult.length && results.length < limit) {
          results.push(providerResult[i]);
        }
      }
    }

    return results;
  }

  public static async ping(): Promise<{ [providerName: string]: boolean }> {
    const pingPromises = this.providers.map(async (Provider) => {
      const isHealthy = await Provider.ping();
      return { [Provider.name]: isHealthy };
    });

    const results = await Promise.all(pingPromises);
    return Object.assign({}, ...results);
  }

  private static extractServiceLetter(gifId: string): string {
    const match = gifId.match(/^g([a-z])-/);
    return match ? match[1] : '';
  }

  private static getProviderByServiceLetter(serviceLetter: string): typeof GifProvider | null {
    return this.providers.find(provider => provider.serviceLetter === serviceLetter) || null;
  }
}
