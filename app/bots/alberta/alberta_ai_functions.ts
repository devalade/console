import Organization from '#models/organization'
import AiFunctionsWrapper from '../../ai_functions_wrapper.js'
import AiFunction from '#decorators/ai_function'

/**
 * We cannot trust GPT-4 to avoid giving access to data from an unauthorized organization for the current user.
 * To avoid that, we have to make sure that AI functions only give access to data that the user has access to.
 * This is why we need to wrap the AI functions in a class that will be instantiated for each organization.
 */
export default function prepareAlbertaAiFunctions(organization: Organization) {
  class AlbertaAiFunctions extends AiFunctionsWrapper {
    @AiFunction('Scaffold some AdonisJS v6 application in the output directory', {
      type: 'object',
      properties: {},
    })
    static async listProjects() {
      const projects = await organization.related('projects').query()
      return { projects }
    }
  }

  return AlbertaAiFunctions
}
