import { describe, expect, it } from "vitest";
import { isSupportedAttachmentSignature } from "./attachments";

describe("isSupportedAttachmentSignature", () => {
  it("accepts valid PDF, PNG, JPEG and WebP signatures", () => {
    expect(isSupportedAttachmentSignature("application/pdf", new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]))).toBe(true);
    expect(isSupportedAttachmentSignature("image/png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
    expect(isSupportedAttachmentSignature("image/jpeg", new Uint8Array([0xff, 0xd8, 0xff]))).toBe(true);
    expect(isSupportedAttachmentSignature("image/webp", new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]))).toBe(true);
  });

  it("rejects mismatched MIME types and truncated signatures", () => {
    expect(isSupportedAttachmentSignature("image/png", new Uint8Array([0xff, 0xd8, 0xff]))).toBe(false);
    expect(isSupportedAttachmentSignature("application/pdf", new Uint8Array([0x25, 0x50]))).toBe(false);
    expect(isSupportedAttachmentSignature("image/gif", new Uint8Array([0x47, 0x49, 0x46, 0x38]))).toBe(false);
  });
});
