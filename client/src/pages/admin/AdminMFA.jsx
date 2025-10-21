import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";

export default function AdminMFA() {
  const inputsRef = useRef([])
  const [values, setValues] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const preview = location.pathname === '/_adm/portal/mfa-open'

  const onChange = (i, v) => {
    if (v.length > 1) v = v.slice(-1)
    const next = [...values]
    next[i] = v
    setValues(next)
    if (v && inputsRef.current[i+1]) inputsRef.current[i+1].focus()
  }

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && inputsRef.current[i-1]) {
      inputsRef.current[i-1].focus()
    }
  }

  const onPaste = (e) => {
    const text = e.clipboardData.getData('text').trim().slice(0,6)
    if (!text) return
    const arr = text.split('').slice(0,6)
    const next = [...values]
    for (let i=0;i<arr.length;i++) next[i]=arr[i]
    setValues(next)
    const last = Math.min(arr.length,5)
    inputsRef.current[last].focus()
    e.preventDefault()
  }

  const code = values.join('')

  const submit = async (e) => {
    e?.preventDefault()
    setError('')
    if (code.length !== 6) {
      setError('Insira o código de 6 dígitos.')
      return
    }
    setLoading(true)
    try {
      if (preview) {
        setMsg('Código verificado (preview)')
        navigate('/admin-open')
        return
      }
      const res = await fetch('/api/admin/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include'
      })
      if (res.ok) {
        navigate('/admin')
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.message || 'Código inválido')
      }
    } catch (err) {
      setError(err.message || 'Erro ao verificar código')
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setMsg('')
    try {
      if (preview) {
        setMsg('Código reenviado (preview) — verifique seu email administrativo')
        return
      }
      const res = await fetch('/api/admin/mfa/resend', { 
        method: 'POST', 
        credentials: 'include' 
      })
      if (res.ok) setMsg('Código reenviado — verifique seu email administrativo')
      else setError('Falha ao reenviar código')
    } catch (e) {
      setError('Erro ao reenviar código')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logoArteBryndes} alt="Arte Bryndes" />
        </div>

        <div className="auth-card">
          <h1>Verificação Administrativa</h1>
          <p className="auth-subtitle">
            Digite o código de 6 dígitos enviado para seu email administrativo.
          </p>

          {error && <div className="auth-error">{error}</div>}
          {msg && <div style={{ color: 'green', marginBottom: 12 }}>{msg}</div>}

          <form onSubmit={submit} onPaste={onPaste} className="auth-form">
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {values.map((v,i) => (
                <input
                  key={i}
                  ref={el => inputsRef.current[i]=el}
                  value={v}
                  onChange={e => onChange(i, e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={e => onKeyDown(i, e)}
                  className="auth-input mfa-code-input"
                  style={{ width: 48, textAlign: 'center', fontSize: '1.25rem' }}
                  inputMode="numeric"
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }} className="mfa-actions">
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
              <button type="button" className="btn outline" onClick={resend}>
                Reenviar código
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-muted">
            Problemas? <button onClick={() => navigate('/_adm/portal/entrar')} className="btn link text-bronze">
              Voltar ao login administrativo
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}