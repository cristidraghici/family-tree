import { FunctionComponent, ComponentProps, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import Modal from '@/components/molecules/Modal'
import ConditionalElement from '@/components/atoms/ConditionalElement'

import usePersonContext from '@/hooks/usePersonContext'

import type { PersonType, PersonIdType } from '@/types'

const PersonsModal: FunctionComponent<ComponentProps<'form'>> = () => {
  const { selectedPerson, persons, handleSelectPerson, removePerson, addPerson } =
    usePersonContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonType>({
    defaultValues: selectedPerson || {},
  })

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)

  useEffect(() => {
    if (!selectedPerson) {
      return
    }

    reset(selectedPerson)
  }, [selectedPerson, reset])

  if (!selectedPerson) {
    return <></>
  }

  const isEditing = selectedPerson.id !== 'new'

  const onClose: () => void = () => {
    reset()
    handleSelectPerson('')
  }

  const onDelete: (id: PersonIdType) => void = (id) => {
    reset()
    removePerson(id)
    handleSelectPerson('')
  }

  const onSubmit: SubmitHandler<PersonType> = (data) => {
    addPerson(data)
    reset()
    handleSelectPerson('')
  }

  return (
    <Modal
      isOpen={true}
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
                      onDelete(selectedPerson.id)
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
              {persons
                .filter(({ id, biologicalGender, ancestors }) => {
                  return (
                    biologicalGender === 'male' &&
                    id !== selectedPerson.id &&
                    !ancestors.includes(selectedPerson.id)
                  )
                })
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
              {persons
                .filter(
                  ({ id, biologicalGender, ancestors }) =>
                    biologicalGender === 'female' &&
                    id !== selectedPerson.id &&
                    !ancestors.includes(selectedPerson.id),
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
