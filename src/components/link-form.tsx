import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { DuplicatedLinkError } from '../errors/duplicated-link-error';
import { useLinks } from '../hooks/use-links';
import { api } from '../service/api';
import { notify } from '../service/toast';
import { Button } from './button';
import { FormField } from './form-field';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const formSchema = z.object({
  original_link: z.url('Informe uma url válida.'),
  short_link: z
    .string()
    .min(1, 'URL encurtada não pode estar vazia.')
    .regex(SLUG_REGEX, 'Informe uma URL minúscula e sem espaço/caracter especial.'),
});

type FormSchema = z.infer<typeof formSchema>;

export function LinkForm() {
  const { addLink } = useLinks();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  const onSubmit: SubmitHandler<FormSchema> = ({ original_link, short_link }) => {
    try {
      const newLink = api.createLink({ original_link, short_link });
      addLink(newLink);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof DuplicatedLinkError) {
        notify({ type: 'error', title: error.title, text: error.message });
      } else {
        notify({ type: 'error', title: 'Eita!', text: 'Erro ao salvar link.' });
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-gray-100 p-6">
      <h2 className="font-lg-bold">Novo link</h2>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            error={errors.original_link?.message}
            id="original_link"
            label="Link original"
            placeholder="www.exemplo.com.br"
            type="url"
            {...register('original_link', { required: true })}
          />

          <FormField
            error={errors.short_link?.message}
            fixedPlaceholder
            id="short_link"
            label="Link encurtado"
            placeholder="brev.ly/"
            type="text"
            {...register('short_link', { required: true })}
          />
        </div>

        <Button type="submit">Salvar link</Button>
      </form>
    </div>
  );
}
