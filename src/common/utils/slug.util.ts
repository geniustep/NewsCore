import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export class SlugUtil {
  /**
   * Generate a URL-friendly slug from text
   */
  static generate(text: string, options?: { unique?: boolean }): string {
    const slug = slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (options?.unique) {
      const uniqueId = uuidv4().split('-')[0];
      return `${slug}-${uniqueId}`;
    }

    return slug;
  }

  /**
   * Generate a unique slug with timestamp
   */
  static generateUnique(text: string): string {
    const baseSlug = this.generate(text);
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  }

  /**
   * Validate if a string is a valid slug
   */
  static isValid(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }
}
