import { useContext } from "react"
import { TiepNhanFormContext } from "../context/TiepNhanFormContext"

export function useTiepNhanForm() {
  const context = useContext(TiepNhanFormContext)
  if (!context) {
    throw new Error('useTiepNhanForm must be used within TiepNhanFormProvider')
  }
  return context
}
