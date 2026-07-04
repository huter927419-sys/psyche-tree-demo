import { createLocalizedBook } from '../shared/createBook'
import { psycheTreePack } from './content'

export const createPsycheTreeBook = createLocalizedBook(psycheTreePack)

export const psycheTreeBook = createPsycheTreeBook('zh')
