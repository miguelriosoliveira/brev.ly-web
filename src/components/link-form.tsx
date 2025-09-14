import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { DuplicateUrlError } from '../errors/duplicated-link-error';
import { useLinks } from '../hooks/use-links';
import { api } from '../service/api';
import { notify } from '../service/toast';
import { Button } from './button';
import { FormField } from './form-field';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const formSchema = z.object({
  original_url: z.url('Informe uma url válida.'),
  short_url: z
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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn({ original_url, short_url }: FormSchema) {
      return api.createLink({ original_url, short_url });
    },
    onSuccess(newLink) {
      addLink(newLink);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError(error) {
      if (error instanceof DuplicateUrlError) {
        notify({ type: 'error', title: error.title, text: error.message });
      } else {
        notify({ type: 'error', title: 'Eita!', text: 'Erro ao salvar link.' });
      }
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = ({ original_url, short_url }) => {
    mutation.mutate({ original_url, short_url });
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-gray-100 p-6">
      <h2 className="font-lg-bold">Novo link</h2>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            type="url"
            id="original_url"
            label="Link original"
            placeholder="www.exemplo.com.br"
            error={errors.original_url?.message}
            disabled={mutation.isPending}
            {...register('original_url', { required: true })}
          />

          <FormField
            type="text"
            fixedPlaceholder
            id="short_url"
            label="Link encurtado"
            placeholder="brev.ly/"
            error={errors.short_url?.message}
            disabled={mutation.isPending}
            {...register('short_url', { required: true })}
          />
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          Salvar link
        </Button>
      </form>
    </div>
  );
}
