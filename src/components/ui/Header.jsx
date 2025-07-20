import React, { useState } from "react";
import Icon from "../AppIcon";
import Button from "./Button";
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut();
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="GitBranch" size={18} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">GitHub Pulse</h1>
                <p className="text-xs text-muted-foreground">Repository Monitor</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Overview
              </a>
              <a href="/pull-request-analytics-dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pull Requests
              </a>
              <a href="/repository-health-monitoring-dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Health
              </a>
              <a href="/team-productivity-analytics-dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Team Analytics
              </a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-foreground">
                        {userProfile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile?.role || 'Member'}
                      </p>
                    </div>
                    <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-1">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {userProfile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {userProfile?.github_username && (
                          <p className="text-xs text-muted-foreground">
                            @{userProfile.github_username}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors flex items-center space-x-2"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAuthModal('login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openAuthModal('signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Icon name="Menu" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Click outside handler for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Header;