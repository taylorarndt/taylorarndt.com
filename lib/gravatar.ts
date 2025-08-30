import crypto from 'crypto'

/**
 * Generate Gravatar URL from email address
 * @param email - User's email address
 * @param size - Size of the image (default: 80)
 * @param defaultImage - Default image type if no Gravatar found (default: 'identicon')
 * @returns Gravatar URL
 */
export function getGravatarUrl(
  email: string, 
  size: number = 80, 
  defaultImage: string = 'identicon'
): string {
  // Create MD5 hash of lowercase email
  const hash = crypto
    .createHash('md5')
    .update(email.toLowerCase().trim())
    .digest('hex')
  
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=g`
}

/**
 * Get multiple Gravatar sizes for responsive images
 * @param email - User's email address
 * @param defaultImage - Default image type if no Gravatar found
 * @returns Object with different sizes
 */
export function getGravatarUrls(email: string, defaultImage: string = 'identicon') {
  return {
    small: getGravatarUrl(email, 32, defaultImage),
    medium: getGravatarUrl(email, 64, defaultImage),
    large: getGravatarUrl(email, 128, defaultImage),
    xlarge: getGravatarUrl(email, 256, defaultImage),
  }
}