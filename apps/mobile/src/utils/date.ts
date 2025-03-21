
export const formatDate = Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

export const forMonth = Intl.DateTimeFormat('pt-BR', {
  month: 'short',
})