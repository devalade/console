import DrapeauService from '#services/drapeau_service'
import env from '#start/env'

DrapeauService.defineFeatureFlag('sign_up', () => env.get('ALLOW_PUBLIC_SIGNUP'))
