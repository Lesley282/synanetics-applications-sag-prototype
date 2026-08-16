import { useState } from 'react'
import { Button, Checkbox, PasswordField, SynaneticsLogoWhiteLargeIcon, TextField } from '@synanetics/syn-library'
import './SignIn.scss'

// Scattered background dots for the brand panel, kept out of the sign-in
// card's rectangle (roughly x 55-100%, y 10-90%). Positions/sizes are fixed
// rather than randomised on each render so the layout doesn't shift on
// re-render.
const PARTICLES = [
  { top: '6%', left: '8%', size: 5, opacity: 0.35 },
  { top: '14%', left: '22%', size: 3, opacity: 0.25 },
  { top: '9%', left: '38%', size: 7, opacity: 0.4 },
  { top: '22%', left: '4%', size: 4, opacity: 0.3 },
  { top: '31%', left: '16%', size: 6, opacity: 0.35 },
  { top: '18%', left: '48%', size: 3, opacity: 0.2 },
  { top: '42%', left: '6%', size: 5, opacity: 0.3 },
  { top: '38%', left: '28%', size: 4, opacity: 0.25 },
  { top: '52%', left: '14%', size: 8, opacity: 0.4 },
  { top: '47%', left: '40%', size: 3, opacity: 0.2 },
  { top: '61%', left: '5%', size: 4, opacity: 0.3 },
  { top: '58%', left: '24%', size: 6, opacity: 0.35 },
  { top: '70%', left: '10%', size: 5, opacity: 0.3 },
  { top: '68%', left: '36%', size: 3, opacity: 0.2 },
  { top: '80%', left: '18%', size: 7, opacity: 0.4 },
  { top: '86%', left: '6%', size: 4, opacity: 0.3 },
  { top: '91%', left: '30%', size: 5, opacity: 0.35 },
  { top: '3%', left: '60%', size: 4, opacity: 0.25 },
  { top: '4%', left: '80%', size: 6, opacity: 0.35 },
  { top: '2%', left: '94%', size: 3, opacity: 0.2 },
  { top: '95%', left: '65%', size: 5, opacity: 0.3 },
  { top: '96%', left: '85%', size: 4, opacity: 0.25 },
  { top: '93%', left: '96%', size: 6, opacity: 0.35 },
]

function SignIn() {
  const [email, setEmail] = useState('name@nhs.net')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  return (
    <div className="SignIn">
      <div className="SignIn__brandPanel">
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="SignIn__particle"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
          />
        ))}
        <div className="SignIn__brandHeader">
          <SynaneticsLogoWhiteLargeIcon />
        </div>
        <div className="SignIn__brandCopy">
          <h1>Connected care, one clinical record.</h1>
          <p>
            Interoperability for health and social care — bringing data from every system into a single, shared view.
          </p>
        </div>
        <span className="SignIn__brandFooter">NHS-aligned · ISO 27001 · DCB0129 clinically assured</span>
      </div>

      <div className="SignIn__formPanel">
        <div className="SignIn__formCard">
          <h2>Sign in</h2>
          <p className="SignIn__formSubtitle">Use your NHS Care Identity credentials.</p>

          <div className="SignIn__fields">
            <TextField label="Email address" value={email} onChange={setEmail} placeholder="name@nhs.net" />
            <PasswordField label="Password" value={password} onChange={setPassword} />

            <div className="SignIn__rememberRow">
              <Checkbox label="Remember me" isSelected={rememberMe} onChange={setRememberMe} />
              <button type="button" className="SignIn__linkButton">
                Forgotten your password?
              </button>
            </div>

            <Button variant="primary" modifier="standard" size="large" className="SignIn__submit">
              Sign in
            </Button>
            <Button variant="secondary" modifier="standard" size="large">
              Sign in with NHS Care Identity
            </Button>
          </div>

          <p className="SignIn__disclaimer">
            Access is monitored and audited. Only view records you are directly involved in caring for.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
