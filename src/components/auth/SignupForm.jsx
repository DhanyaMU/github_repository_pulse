import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';

const SignupForm = ({ onToggleMode, onClose }) => {
  const { signUp, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    github_username: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (authError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!formData.email || !formData.password || !formData.full_name) return;

    setLoading(true);
    try {
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        github_username: formData.github_username,
        role: 'member'
      });
      
      if (result?.success) {
        onClose?.();
      }
    } catch (error) {
      console.log('Signup form error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = formData.password === formData.confirmPassword;
  const passwordError = formData.confirmPassword && !passwordMatch;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
        <p className="text-muted-foreground">
          Join GitHub Repository Pulse to monitor your repositories
        </p>
      </div>

      {authError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{authError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="github_username" className="block text-sm font-medium text-foreground mb-2">
            GitHub Username <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="github_username"
            name="github_username"
            type="text"
            value={formData.github_username}
            onChange={handleChange}
            placeholder="Enter your GitHub username"
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              disabled={loading}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
              className={`w-full pr-10 ${passwordError ? 'border-destructive' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
          {passwordError && (
            <p className="mt-1 text-sm text-destructive">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.email || !formData.password || !formData.full_name || passwordError}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-medium"
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;