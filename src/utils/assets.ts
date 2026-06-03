const resourceBase =
  typeof window === 'undefined'
    ? `${import.meta.env.BASE_URL}resources/`
    : new URL('resources/', window.location.href).toString();

export const resources = {
  background: `${resourceBase}alo-bg-texture.png`,
  emptyState: `${resourceBase}alo-empty-state.png`,
  logoPixel: `${resourceBase}alo-logo-pixel.png`,
};
