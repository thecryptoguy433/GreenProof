import { describe, it, expect, beforeEach } from "vitest"

type Result =
  | { value: boolean }
  | { error: number }

interface MockContract {
  admin: string
  verifiedAuthorities: Map<string, boolean>

  isAdmin: (caller: string) => boolean
  addAuthority: (caller: string, authority: string) => Result
  removeAuthority: (caller: string, authority: string) => Result
  isVerifiedAuthority: (authority: string) => boolean
  transferAdmin: (caller: string, newAdmin: string) => Result
}

const mockContract: MockContract = {
  admin: "ST1ADMIN0000000000000000000000000000000000",
  verifiedAuthorities: new Map<string, boolean>(),

  isAdmin(caller: string): boolean {
    return caller === this.admin
  },

  addAuthority(caller: string, authority: string): Result {
    if (!this.isAdmin(caller)) {
      return { error: 100 } // ERR-NOT-AUTHORIZED
    }

    if (this.verifiedAuthorities.has(authority)) {
      return { error: 101 } // ERR-ALREADY-VERIFIED
    }

    this.verifiedAuthorities.set(authority, true)
    return { value: true }
  },

  removeAuthority(caller: string, authority: string): Result {
    if (!this.isAdmin(caller)) {
      return { error: 100 }
    }

    if (!this.verifiedAuthorities.has(authority)) {
      return { error: 102 }
    }

    this.verifiedAuthorities.delete(authority)
    return { value: true }
  },

  isVerifiedAuthority(authority: string): boolean {
    return this.verifiedAuthorities.has(authority)
  },

  transferAdmin(caller: string, newAdmin: string): Result {
    if (!this.isAdmin(caller)) {
      return { error: 100 }
    }

    this.admin = newAdmin
    return { value: true }
  }
}

describe("GreenProof Authority Access Control", () => {
  beforeEach(() => {
    mockContract.admin = "ST1ADMIN0000000000000000000000000000000000"
    mockContract.verifiedAuthorities = new Map()
  })

  it("allows admin to add a new authority", () => {
    const result = mockContract.addAuthority(
      "ST1ADMIN0000000000000000000000000000000000",
      "ST2AUTHORITY000000000000000000000000000000"
    )

    expect(result).toEqual({ value: true })
    expect(mockContract.isVerifiedAuthority("ST2AUTHORITY000000000000000000000000000000")).toBe(true)
  })

  it("rejects addAuthority from non-admin", () => {
    const result = mockContract.addAuthority(
      "ST3USER000000000000000000000000000000000000",
      "ST2AUTHORITY000000000000000000000000000000"
    )

    expect(result).toEqual({ error: 100 }) // ERR-NOT-AUTHORIZED
    expect(mockContract.isVerifiedAuthority("ST2AUTHORITY000000000000000000000000000000")).toBe(false)
  })

  it("prevents adding already verified authority", () => {
    mockContract.addAuthority(
      "ST1ADMIN0000000000000000000000000000000000",
      "ST2AUTHORITY000000000000000000000000000000"
    )

    const result = mockContract.addAuthority(
      "ST1ADMIN0000000000000000000000000000000000",
      "ST2AUTHORITY000000000000000000000000000000"
    )

    expect(result).toEqual({ error: 101 }) // ERR-ALREADY-VERIFIED
  })

  it("allows admin to remove an authority", () => {
    mockContract.addAuthority(
      "ST1ADMIN0000000000000000000000000000000000",
      "ST2AUTHORITY000000000000000000000000000000"
    )

    const result = mockContract.removeAuthority(
      "ST1ADMIN0000000000000000000000000000000000",
      "ST2AUTHORITY000000000000000000000000000000"
    )

    expect(result).toEqual({ value: true })
    expect(mockContract.isVerifiedAuthority("ST2AUTHORITY000000000000000000000000000000")).toBe(false)
  })

  it("rejects removal of non-existent authority", () => {
    const result = mockContract.removeAuthority(
      "ST1ADMIN0000000000000000000000000000000000",
      "ST2NONEXISTENT0000000000000000000000000000"
    )

    expect(result).toEqual({ error: 102 }) // ERR-NOT-FOUND
  })

  it("allows admin to transfer admin rights", () => {
    const result = mockContract.transferAdmin(
      "ST1ADMIN0000000000000000000000000000000000",
      "ST4NEWADMIN0000000000000000000000000000000"
    )

    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("ST4NEWADMIN0000000000000000000000000000000")

    // Now test that new admin can add an authority
    const addResult = mockContract.addAuthority(
      "ST4NEWADMIN0000000000000000000000000000000",
      "ST5AUTHORITY000000000000000000000000000000"
    )

    expect(addResult).toEqual({ value: true })
  })

  it("rejects admin transfer by non-admin", () => {
    const result = mockContract.transferAdmin(
      "ST6USER000000000000000000000000000000000000",
      "ST4NEWADMIN0000000000000000000000000000000"
    )

    expect(result).toEqual({ error: 100 }) // ERR-NOT-AUTHORIZED
  })
})
