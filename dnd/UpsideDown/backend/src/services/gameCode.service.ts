import { randomBytes } from 'crypto';

export class GameCodeService {
  private static instance: GameCodeService;
  private activeCodes: Map<string, {
    sessionId: string;
    expiresAt: Date;
  }> = new Map();

  static getInstance() {
    if (!GameCodeService.instance) {
      GameCodeService.instance = new GameCodeService();
    }
    return GameCodeService.instance;
  }

  generateCode(sessionId: string): string {
    // Generate a 6-character alphanumeric code
    const code = randomBytes(3)
      .toString('hex')
      .toUpperCase();
    
    // Store code with 24-hour expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    this.activeCodes.set(code, {
      sessionId,
      expiresAt
    });

    return code;
  }

  validateCode(code: string): string | null {
    const session = this.activeCodes.get(code);
    if (!session) return null;
    
    if (new Date() > session.expiresAt) {
      this.activeCodes.delete(code);
      return null;
    }

    return session.sessionId;
  }
} 