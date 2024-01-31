import { FunctionComponent, ComponentProps, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import Modal from '@/components/molecules/Modal'
import ConditionalElement from '@/components/atoms/ConditionalElement'

import type { PersonType, ExtendedPersonType, PersonIdType } from '@/utils/PersonRegistry'

const PersonsModal: FunctionComponent<
  ComponentProps<'form'> & {
    person: PersonType | { id: PersonIdType }

    everybody: ExtendedPersonType[]
    onSuccess: (data: PersonType) => void
    onRemove: (id: PersonIdType) => void
    onCancel: () => void
  }
> = ({ person, everybody, onSuccess, onRemove, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonType>({
    defaultValues: person,
  })

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const isEditing = person.id !== 'new'

  useEffect(() => {
    reset(person)
  }, [person, reset])

  const onClose: () => void = () => {
    reset()
    onCancel()
  }

  const onDelete: (id: PersonIdType) => void = (id) => {
    reset()
    onRemove(id)
  }

  const onSubmit: SubmitHandler<PersonType> = (data) => {
    reset()
    onSuccess(data)
  }

  return (
    <Modal
      isOpen={!!person}
      header={
        <>
          <a
            href="#"
            aria-label="Close"
            rel="prev"
            onClick={(e) => {
              e.preventDefault()
              onClose()
            }}
          />
          <h1>Person Details</h1>
        </>
      }
      footer={
        <footer>
          <div>
            <ConditionalElement as="div" condition={isEditing} className="DeleteConfirmation">
              <ConditionalElement condition={!isDeleteConfirmationOpen}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsDeleteConfirmationOpen(true)
                  }}
                >
                  Delete?
                </a>
              </ConditionalElement>
              <ConditionalElement condition={isDeleteConfirmationOpen}>
                Are you sure?
                <div className="DeleteConfirmation_Actions">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onDelete(person.id)
                    }}
                  >
                    Yes
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsDeleteConfirmationOpen(false)
                    }}
                  >
                    No
                  </a>
                </div>
              </ConditionalElement>
            </ConditionalElement>
            <div />

            <div>
              <button className="secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmit(onSubmit)}>
                Save
              </button>
            </div>
          </div>
        </footer>
      }
      onEscape={onClose}
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
                .filter(
                  ({ id, biologicalGender }) => biologicalGender === 'male' && id !== person.id,
                )
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
                .filter(
                  ({ id, biologicalGender }) => biologicalGender === 'female' && id !== person.id,
                )
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
