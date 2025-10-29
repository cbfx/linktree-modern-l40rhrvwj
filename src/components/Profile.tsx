/**
 * Profile component for displaying user information
 */

import React from 'react';
import { MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import type { ProfileProps } from '@/types/config';

/**
 * Profile component that displays user avatar, name, bio, and location
 */
export function Profile({ profile, className }: ProfileProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Profile';
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    img.classList.add('profile-enter');
  };

  return (
    <section 
      className={clsx('profile-section', className)}
      aria-labelledby="profile-name"
    >
      {/* Profile Avatar */}
      <div className="relative">
        <img
          src={profile.avatar}
          alt={`${profile.name}'s profile picture`}
          className="profile-avatar"
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="eager"
          width={144}
          height={144}
        />
        
        {/* Avatar loading placeholder */}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse profile-avatar" 
             style={{ zIndex: -1 }} />
      </div>

      {/* Profile Name */}
      <h1 
        id="profile-name"
        className="profile-name"
      >
        {profile.name}
      </h1>

      {/* Profile Bio */}
      {profile.bio && (
        <p className="profile-bio">
          {profile.bio}
        </p>
      )}

      {/* Profile Location */}
      {profile.location && (
        <div className="profile-location">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>{profile.location}</span>
        </div>
      )}

      {/* Structured data for SEO - removed for security */}
      <script 
        type="application/ld+json"
        id="profile-structured-data"
        ref={(element) => {
          if (element) {
            // Safely generate structured data without dangerouslySetInnerHTML
            const structuredData = {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": profile.name,
              "description": profile.bio,
              "image": profile.avatar,
              ...(profile.location && { "address": profile.location })
            };
            element.textContent = JSON.stringify(structuredData);
          }
        }}
      />
    </section>
  );
}

/**
 * ProfileSkeleton component for loading state
 */
export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <section className={clsx('profile-section', className)} aria-label="Loading profile">
      {/* Avatar skeleton */}
      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full skeleton mx-auto" />
      
      {/* Name skeleton */}
      <div className="h-8 w-48 skeleton mx-auto rounded" />
      
      {/* Bio skeleton */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="h-4 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded mx-auto" />
      </div>
      
      {/* Location skeleton */}
      <div className="h-4 w-32 skeleton rounded mx-auto" />
    </section>
  );
}

/**
 * ProfileAvatar component for reusable avatar display
 */
export function ProfileAvatar({ 
  src, 
  alt, 
  size = 'lg',
  className 
}: {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-28 h-28 sm:w-36 sm:h-36',
    xl: 'w-32 h-32 sm:w-40 sm:h-40'
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    img.src = `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(alt.charAt(0).toUpperCase())}`;
  };

  return (
    <div className={clsx('relative', className)}>
      <img
        src={src}
        alt={alt}
        className={clsx(
          'rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-soft',
          'transition-transform duration-300 hover:scale-105',
          sizeClasses[size]
        )}
        onError={handleError}
        loading="eager"
      />
    </div>
  );
}

/**
 * ProfileBadge component for compact profile display
 */
export function ProfileBadge({ 
  profile, 
  showLocation = false,
  className 
}: {
  profile: ProfileProps['profile'];
  showLocation?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <ProfileAvatar 
        src={profile.avatar}
        alt={profile.name}
        size="md"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
          {profile.name}
        </h3>
        
        {profile.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {profile.bio}
          </p>
        )}
        
        {showLocation && profile.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{profile.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ProfileCard component for card-style profile display
 */
export function ProfileCard({ 
  profile, 
  className,
  children 
}: {
  profile: ProfileProps['profile'];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 text-center',
      'border border-gray-200 dark:border-gray-700',
      className
    )}>
      <ProfileAvatar 
        src={profile.avatar}
        alt={profile.name}
        size="lg"
        className="mx-auto mb-4"
      />
      
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {profile.name}
      </h2>
      
      {profile.bio && (
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          {profile.bio}
        </p>
      )}
      
      {profile.location && (
        <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{profile.location}</span>
        </div>
      )}
      
      {children}
    </div>
  );
}

/**
 * ProfileHeader component for page header usage
 */
export function ProfileHeader({ 
  profile, 
  className,
  actions 
}: {
  profile: ProfileProps['profile'];
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className={clsx('flex items-center justify-between', className)}>
      <ProfileBadge profile={profile} showLocation />
      
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}

export default Profile;