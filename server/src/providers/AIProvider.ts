export interface AIProvider {
  /**
   * Generates raw study material object from lecture text.
   * May receive retry errors from prior validation failure.
   */
  generateStudyMaterial(text: string, retryErrors?: string[]): Promise<unknown>;
}
