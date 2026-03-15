import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LangService } from '../services/LangService'

export const useLang = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (locale: string) => LangService.updateLocale(locale),
    onSuccess: () => {
      // invalida il profilo utente così useAuth() si riaggiorna
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}