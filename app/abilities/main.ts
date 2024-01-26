/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import Project from '#models/project'
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const accessToProject = Bouncer.ability((user: User, project: Project) => {
  return project.userId === user.id
})
