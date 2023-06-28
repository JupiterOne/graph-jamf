const normalizeOsVersion = (osVersion: string): string => {
  if (!osVersion) {
    return osVersion;
  }

  const [major, minor = '0', patch = '0'] = osVersion.split('.');

  return [major, minor, patch].join('.');
};

export const deviceNormalizer = {
  normalizeOsVersion,
};
