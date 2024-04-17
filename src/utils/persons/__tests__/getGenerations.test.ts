import getGenerations from '../getGenerations'
import type { PersonType, RelationshipType } from '@/types'
import RegistryJSON from '@/data/registry.json'

describe('getGenerations', () => {
  it('should return correct generations for a set of persons and relationships', () => {
    // Prepare the data
    const { persons, relationships } = RegistryJSON

    const JosephineBaden = '09256fab-15c0-4c8e-baaf-8be631de6897'
    const KarlAnton = 'd9a897dc-ce1c-43cc-ab28-84bc337637e0'
    const CarolTheFirst = 'c0e5d0f5-a20e-4ec1-a95f-0167bdd5adc6'
    const Leopold = '9e4b2100-152e-4151-adf0-3802b574c5af'

    // Call the function
    const generations = getGenerations(persons as PersonType[], relationships as RelationshipType[])

    // Output example:
    // {
    //   '09256fab-15c0-4c8e-baaf-8be631de6897': 1,
    //   'd9a897dc-ce1c-43cc-ab28-84bc337637e0': 1,
    //   'c0e5d0f5-a20e-4ec1-a95f-0167bdd5adc6': 2,
    //   'f3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3f': 1,
    //   '9e4b2100-152e-4151-adf0-3802b574c5af': 2,
    //   ...
    // }

    // Assertions
    expect(generations[JosephineBaden]).toBe(1)
    expect(generations[KarlAnton]).toBe(1)
    expect(generations[CarolTheFirst]).toBe(2)
    expect(generations[Leopold]).toBe(2)
  })
})
