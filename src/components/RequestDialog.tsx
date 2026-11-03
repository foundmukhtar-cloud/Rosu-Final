import { useEffect, useRef, useState, type FormEvent } from 'react';

type RequestDialogProps = {
  open: boolean;
  onClose: () => void;
  defaultRole?: string;
  defaultPropertyType?: string;
};

export function RequestDialog({
  open,
  onClose,
  defaultRole = 'Homeowner',
  defaultPropertyType = 'Single-family',
}: RequestDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [propertyType, setPropertyType] = useState(defaultPropertyType);

  useEffect(() => {
    if (defaultRole) setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    if (defaultPropertyType) setPropertyType(defaultPropertyType);
  }, [defaultPropertyType]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => firstFieldRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setStatus('');
      onClose();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus(
      'Your appraisal inquiry has been received. Our New York appraisal management desk will contact you within 1 business day with engagement terms.',
    );
  };

  return (
    <dialog
      className="dialog"
      ref={dialogRef}
      aria-labelledby="request-title"
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <form className="dialog__form" onSubmit={handleSubmit}>
        <div className="dialog__head">
          <p className="eyebrow">Appraisal request · New York</p>
          <h2 id="request-title" className="dialog__title">
            Tell us about the property.
          </h2>
          <p className="dialog__subtitle">
            Provide property and contact details. We will confirm scope, coverage, and turn time.
          </p>
        </div>

        <button
          type="button"
          className="dialog__close"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close request form"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="field">
          <label htmlFor="request-name">Full name</label>
          <input
            id="request-name"
            name="name"
            ref={firstFieldRef}
            autoComplete="name"
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="request-email">Email address</label>
            <input
              id="request-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@organization.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="request-role">I am a</label>
            <select
              id="request-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Lender">Lender / Underwriter</option>
              <option value="Broker">Broker / Advisor</option>
              <option value="Appraiser">Certified Appraiser</option>
              <option value="Homeowner">Property Owner</option>
              <option value="Attorney">Attorney / Fiduciary</option>
              <option value="Other">Other Institutional</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="request-address">Property address & borough / county</label>
          <input
            id="request-address"
            name="address"
            autoComplete="street-address"
            placeholder="e.g. 123 Park Avenue, New York, NY 10022"
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="request-type">Property type</label>
            <select
              id="request-type"
              name="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="Single-family">Single-family / Brownstone</option>
              <option value="Condominium">Condominium / Co-op</option>
              <option value="Multifamily">Multifamily (2–4 Units)</option>
              <option value="Commercial">Commercial / Mixed-Use</option>
              <option value="Estate">Historic Estate</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="request-purpose">Valuation purpose</label>
            <select id="request-purpose" name="purpose" defaultValue="Purchase">
              <option value="Purchase">Purchase / Acquisition</option>
              <option value="Refinance">Mortgage Refinance</option>
              <option value="Estate">Estate / Probate / Trust</option>
              <option value="Tax">Property Tax Appeal</option>
              <option value="Portfolio">Portfolio Valuation</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="request-notes">Additional notes or timing requirements (optional)</label>
          <textarea
            id="request-notes"
            name="notes"
            rows={3}
            placeholder="Special architectural features, timeline constraints, or specific UAD 3.6 data needs..."
          />
        </div>

        <div className="dialog__actions">
          <button type="submit" className="btn btn--navy">
            Submit request
          </button>
          <p className="dialog__status" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </form>
    </dialog>
  );
}
