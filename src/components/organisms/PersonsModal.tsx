import { FunctionComponent, ComponentProps, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import Modal from '@/components/molecules/Modal'

import { PersonType, ExtendedPersonType, PersonIdType } from '@/utils/PersonRegistryUtil'

type PartialPersonType = Partial<PersonType>

const PersonsModal: FunctionComponent<
  ComponentProps<'form'> & {
    person: PartialPersonType | { id: PersonIdType }

    everybody: ExtendedPersonType[]
    onSuccess: (data: PartialPersonType) => void
    onCancel: () => void
  }
> = ({ person, everybody, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartialPersonType>({
    defaultValues: person,
  })

  useEffect(() => {
    reset(person)
  }, [person, reset])

  const onClose: () => void = () => {
    reset()
    onCancel()
  }

  const onSubmit: SubmitHandler<PartialPersonType> = (data) => {
    reset()
    onSuccess(data)
  }

  return (
    <Modal
      isOpen={!!person}
      header={
        <>
          <a href="#" aria-label="Close" rel="prev" onClick={onClose} />
          <h1>Person Details</h1>
        </>
      }
      footer={
        <footer>
          <button className="secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit(onSubmit)}>
            Save
          </button>
        </footer>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rows">
          <div>
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              {...register('firstName', { required: 'This is required' })}
              aria-invalid={errors.firstName ? 'true' : undefined}
            />
            {errors.firstName && <small>{errors.firstName.message}</small>}
          </div>
          <div>
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              {...register('lastName', { required: 'This is required' })}
              aria-invalid={errors.lastName ? 'true' : undefined}
            />
            {errors.lastName && <small>{errors.lastName.message}</small>}
          </div>
          <div>
            <label htmlFor="biologicalGender">Gender</label>
            <select
              id="biologicalGender"
              {...register('biologicalGender', { required: 'This is required' })}
              aria-invalid={errors.biologicalGender ? 'true' : undefined}
            >
              <option></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.biologicalGender && <small>{errors.biologicalGender.message}</small>}
          </div>
        </div>
        <div className="rows">
          <div>
            <label htmlFor="fatherId">Father</label>
            <select
              id="fatherId"
              {...register('fatherId')}
              aria-invalid={errors.fatherId ? 'true' : undefined}
            >
              <option></option>
              {everybody
                .filter(({ biologicalGender }) => biologicalGender === 'male')
                .map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName}
                  </option>
                ))}
            </select>
            {errors.fatherId && <small>{errors.fatherId.message}</small>}
          </div>
          <div>
            <label htmlFor="motherId">Mother</label>
            <select
              id="motherId"
              {...register('motherId')}
              aria-invalid={errors.motherId ? 'true' : undefined}
            >
              <option></option>
              {everybody
                .filter(({ biologicalGender }) => biologicalGender === 'female')
                .map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName}
                  </option>
                ))}
            </select>
            {errors.motherId && <small>{errors.motherId.message}</small>}
          </div>
        </div>
        <div>
          <label htmlFor="biography">Biography</label>
          <textarea
            id="biography"
            {...register('biography')}
            aria-invalid={errors.biography ? 'true' : undefined}
          />
          {errors.biography && <small>{errors.biography.message}</small>}
        </div>
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            {...register('notes')}
            aria-invalid={errors.notes ? 'true' : undefined}
          />
          {errors.notes && <small>{errors.notes.message}</small>}
          <small>
            You can include information about other names, the date and place of birth, the date and
            place of death, marriage, occupation, education, military service, residences etc.
          </small>
        </div>
      </form>
    </Modal>
  )
}
export default PersonsModal
