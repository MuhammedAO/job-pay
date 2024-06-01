import React, { createContext, useContext, useState, ReactNode } from "react"

interface UserContextType {
  profileId: number | null
  setProfileId: (id: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [profileId, setProfileId] = useState<number | null>(null)

  const handleSetProfileId = (id: number) => {
    setProfileId(id)
  }

  return (
    <UserContext.Provider
      value={{ profileId, setProfileId: handleSetProfileId }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
