import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Persona, CreatePersonaDTO, UpdatePersonaDTO, tipoPersonaOptions, rolUsuarioOptions, PersonaFormProps } from '../types';
import { Input, Button, Select, FormItem, FormContainer } from '@/components/ui';

export function PersonaForm({
  initialValues,
  onSubmit,
  onCancel,
}: PersonaFormProps) {
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
  } = useForm<CreatePersonaDTO | UpdatePersonaDTO>({
    defaultValues: initialValues || {
      nombre: '',
      email: '',
      telefono: '',
      cvu: '',
      tipo: undefined,
      roles: [],
      ...(initialValues ? {} : { password: '' }),
    },
  });

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormItem
          label="Nombre"
          invalid={Boolean(errors.nombre)}
          errorMessage={errors.nombre?.message}
        >
          <Controller
            name="nombre"
            control={control}
            rules={{ required: 'El nombre es requerido' }}
            render={({ field }) => (
              <Input {...field} />
            )}
          />
        </FormItem>

        <FormItem
          label="Email"
          invalid={Boolean(errors.email)}
          errorMessage={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{ 
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            }}
            render={({ field }) => (
              <Input {...field} type="email" />
            )}
          />
        </FormItem>

        {!initialValues && (
          <FormItem
            label="Contraseña"
            invalid={Boolean(errors.password)}
            errorMessage={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              rules={{ 
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              }}
              render={({ field }) => (
                <Input {...field} type="password" />
              )}
            />
          </FormItem>
        )}

        <FormItem
          label="Teléfono"
          invalid={Boolean(errors.telefono)}
          errorMessage={errors.telefono?.message}
        >
          <Controller
            name="telefono"
            control={control}
            render={({ field }) => (
              <Input {...field} />
            )}
          />
        </FormItem>

        <FormItem
          label="CVU"
          invalid={Boolean(errors.cvu)}
          errorMessage={errors.cvu?.message}
        >
          <Controller
            name="cvu"
            control={control}
            render={({ field }) => (
              <Input {...field} />
            )}
          />
        </FormItem>

        <FormItem
          label="Tipo"
          invalid={Boolean(errors.tipo)}
          errorMessage={errors.tipo?.message}
        >
          <Controller
            name="tipo"
            control={control}
            rules={{ required: 'El tipo es requerido' }}
            render={({ field }) => (
              <Select
                options={tipoPersonaOptions}
                value={tipoPersonaOptions.find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="Roles"
          invalid={Boolean(errors.roles)}
          errorMessage={errors.roles?.message}
        >
          <Controller
            name="roles"
            control={control}
            rules={{ required: 'Al menos un rol es requerido' }}
            render={({ field }) => (
              <Select
                isMulti
                options={rolUsuarioOptions}
                value={rolUsuarioOptions.filter(option => 
                  field.value?.includes(option.value)
                )}
                onChange={options => 
                  field.onChange(options.map(option => option.value))
                }
              />
            )}
          />
        </FormItem>

        <div className="col-span-2 flex justify-end gap-2 mt-4">
          {onCancel && (
            <Button variant="plain" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button variant="solid" type="submit">
            {initialValues ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
}

export default PersonaForm;
