import type { AiFunction } from '#types/ai_function'

export default abstract class AiFunctionsWrapper {
  static functions: Record<string, AiFunction> = {}
}
