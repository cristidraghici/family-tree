import getConnections from '../getConnections'
import type { PersonType, RelationshipType } from '@/types'
import RegistryJSON from '@/data/registry.json'

describe('getConnections', () => {
  it('should return correct connections for a set of persons and relationships', () => {
    // Prepare the data
    const { persons, relationships } = RegistryJSON

    const JosephineBaden = '09256fab-15c0-4c8e-baaf-8be631de6897'
    const KarlAnton = 'd9a897dc-ce1c-43cc-ab28-84bc337637e0'
    const CarolTheFirst = 'c0e5d0f5-a20e-4ec1-a95f-0167bdd5adc6'
    const Leopold = '9e4b2100-152e-4151-adf0-3802b574c5af'

    // Call the function
    const connections = getConnections(persons as PersonType[], relationships as RelationshipType[])

    // Output example:
    // {
    //   parents: {
    //     '09256fab-15c0-4c8e-baaf-8be631de6897': [],
    //     'd9a897dc-ce1c-43cc-ab28-84bc337637e0': [],
    //     'c0e5d0f5-a20e-4ec1-a95f-0167bdd5adc6': [
    //       'd9a897dc-ce1c-43cc-ab28-84bc337637e0',
    //       '09256fab-15c0-4c8e-baaf-8be631de6897'
    //     ]
    //   },
    //   spouses: {
    //     ...
    //   },
    //   ...
    // }

    // Assertions
    expect(connections.parents[CarolTheFirst].sort()).toEqual([JosephineBaden, KarlAnton].sort())
    expect(connections.parents[JosephineBaden]).toEqual([])
    expect(connections.parents[KarlAnton]).toEqual([])
    expect(connections.spouses[KarlAnton]).toEqual([JosephineBaden])
    expect(connections.children[KarlAnton].includes(CarolTheFirst)).toBe(true)
    expect(connections.children[KarlAnton].includes(Leopold)).toBe(true)
    expect(connections.siblings[CarolTheFirst].includes(Leopold)).toBe(true)
    expect(connections.siblings[Leopold].includes(CarolTheFirst)).toBe(true)
    expect(connections.descendants[KarlAnton].includes(CarolTheFirst)).toBe(true)
    expect(connections.descendants[KarlAnton].includes(Leopold)).toBe(true)
    expect(connections.ancestors[CarolTheFirst].includes(KarlAnton)).toBe(true)
    expect(connections.ancestors[CarolTheFirst].includes(JosephineBaden)).toBe(true)
  })
})
