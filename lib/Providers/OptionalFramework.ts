export function isFrameworkAvailable(framework: string): boolean {
  try {
    require.resolve(framework);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "MODULE_NOT_FOUND") {
      throw error;
    }
    return false;
  }
}
