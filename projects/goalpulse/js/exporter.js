/**
 * Exports the pure #export-canvas element (excluding the OS overlay)
 * as a crisp, high-resolution PNG file.
 */
export async function exportWallpaperPng(element, state) {
    if (!window.htmlToImage) {
      throw new Error('Export library (html-to-image) failed to load.');
    }
  
    // Scale up so mobile exports ~1170px wide and desktop exports ~2560px wide
    const pixelRatio = state.device === 'mobile' ? 3.5 : 3;
  
    const dataUrl = await window.htmlToImage.toPng(element, {
      cacheBust: true,
      pixelRatio,
      skipFonts: false,
    });
  
    const slug = (state.title || 'deadline')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  
    const filename = `${slug}-${state.template}-${state.device}.png`;
  
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  
    return filename;
  }