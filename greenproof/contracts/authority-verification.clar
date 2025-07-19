;; authority-verification.clar
;; GreenProof - Access Control for Validator Authorities

(define-data-var admin principal tx-sender)

;; Map of verified authority validators
(define-map verified-authorities principal bool)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-VERIFIED u101)
(define-constant ERR-NOT-FOUND u102)

;; Check if the caller is admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; Add a new authority validator (only admin)
(define-public (add-authority (authority principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-none (map-get? verified-authorities authority)) (err ERR-ALREADY-VERIFIED))
    (ok (map-set verified-authorities authority true))
  )
)

;; Remove an authority validator (only admin)
(define-public (remove-authority (authority principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? verified-authorities authority)) (err ERR-NOT-FOUND))
    (ok (map-delete verified-authorities authority))
  )
)

;; Check if a validator is verified
(define-read-only (is-verified-authority (authority principal))
  (default-to false (map-get? verified-authorities authority))
)

;; Transfer admin rights to a new principal
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)
