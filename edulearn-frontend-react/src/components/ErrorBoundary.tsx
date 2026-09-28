import { Component, type ReactNode } from 'react';

/**
 * Last-resort guard so a render error becomes a recoverable message instead of
 * a blank white screen, the app has no server render, so an uncaught throw in
 * any route unmounts everything and leaves nothing on the page.
 *
 * `resetKey` (the current pathname) is passed from App: when it changes, the
 * boundary clears its error so navigating away from the broken route recovers
 * without a full reload.
 */
interface Props {
  children: ReactNode;
  resetKey: string;
}
interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 520, margin: '18vh auto', padding: '0 24px', textAlign: 'center', fontFamily: 'Nunito, system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 22, marginBottom: 10 }}>Something went wrong on this page</h1>
          <p style={{ opacity: 0.7, marginBottom: 22, lineHeight: 1.5 }}>
            The page hit an unexpected error. Your work is safe, head back and try again.
          </p>
          <a
            href="/dashboard"
            style={{ display: 'inline-block', padding: '11px 22px', borderRadius: 11, background: '#10B981', color: '#fff', fontWeight: 700, textDecoration: 'none' }}
          >
            Back to dashboard
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
