import { FunctionComponent, ComponentProps, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import Modal from '@/components/molecules/Modal'
import Condition from '@/components/atoms/ConditionalElement'

import FormInput from '@/components/atoms/FormInput'
import FormSelect from '@/components/atoms/FormSelect'
import FormTextarea from '@/components/atoms/FormTextarea'
import TextWithConfirmedAction from '@/components/molecules/TextWithConfirmedAction'

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

  useEffect(() => {
    if (!selectedPerson) {
      reset({})
      return
    }

    reset(selectedPerson)

    return () => {
      reset({})
    }
  }, [selectedPerson, reset])

  if (!selectedPerson) {
    return <></>
  }

  const isEditing = selectedPerson.id !== 'new'

  const onClose: () => void = () => {
    reset({})
    handleSelectPerson('')
  }

  const onDelete: (id: PersonIdType) => void = (id) => {
    reset({})
    removePerson(id)
    handleSelectPerson('')
  }

  const onSubmit: SubmitHandler<PersonType> = (data) => {
    addPerson(data)
    reset({})
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
            <Condition
              as={TextWithConfirmedAction}
              condition={isEditing}
              className="DeleteConfirmation"
              onConfirm={() => {
                onDelete(selectedPerson.id)
              }}
            >
              Delete?
            </Condition>

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
          <FormInput
            id="firstName"
            label="First name"
            error={errors.firstName?.message}
            register={register}
          />

          <FormInput
            id="lastName"
            label="Last name"
            error={errors.lastName?.message}
            register={register}
          />

          <FormSelect
            id="biologicalGender"
            label="Gender"
            error={errors.biologicalGender?.message}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
            register={register}
          />
        </div>
        <div className="rows">
          <FormSelect
            id="fatherId"
            label="Father"
            error={errors.fatherId?.message}
            options={persons
              .filter(({ id, biologicalGender, ancestors }) => {
                return (
                  biologicalGender === 'male' &&
                  id !== selectedPerson.id &&
                  !ancestors.includes(selectedPerson.id)
                )
              })
              .map((person) => ({ value: person.id, label: person.fullName }))}
            register={register}
          />

          <FormSelect
            id="motherId"
            label="Mother"
            error={errors.motherId?.message}
            options={persons
              .filter(
                ({ id, biologicalGender, ancestors }) =>
                  biologicalGender === 'female' &&
                  id !== selectedPerson.id &&
                  !ancestors.includes(selectedPerson.id),
              )
              .map((person) => ({ value: person.id, label: person.fullName }))}
            register={register}
          />
        </div>

        <FormTextarea
          id="biography"
          label="Biography"
          error={errors.biography?.message}
          register={register}
        />

        <FormTextarea
          id="notes"
          label="Notes"
          note="You can include information about other names, the date and place of birth, the date and place of death, marriage, occupation, education, military service, residences etc."
          error={errors.notes?.message}
          register={register}
        />
      </form>
    </Modal>
  )
}

export default PersonsModal
