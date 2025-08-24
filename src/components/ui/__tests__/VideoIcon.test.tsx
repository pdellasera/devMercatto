import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { VideoIcon } from '../VideoIcon';

describe('VideoIcon Component', () => {
  it('renders with default props', () => {
    render(<VideoIcon src="https://example.com/video.jpg" alt="Video thumbnail" />);
    
    const image = screen.getByAltText('Video thumbnail');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/video.jpg');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <VideoIcon src="https://example.com/video.jpg" alt="Video" size="sm" />
    );
    
    let container = screen.getByAltText('Video').closest('div');
    expect(container).toHaveClass('w-16', 'h-16');

    rerender(
      <VideoIcon src="https://example.com/video.jpg" alt="Video" size="lg" />
    );
    container = screen.getByAltText('Video').closest('div');
    expect(container).toHaveClass('w-32', 'h-32');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        onClick={handleClick}
      />
    );
    
    const container = screen.getByAltText('Video').closest('div');
    fireEvent.click(container);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows play button by default', () => {
    render(<VideoIcon src="https://example.com/video.jpg" alt="Video" />);
    
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it('hides play button when showPlayButton is false', () => {
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        showPlayButton={false}
      />
    );
    
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        loading
      />
    );
    
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        error="Failed to load video"
      />
    );
    
    expect(screen.getByText('Failed to load video')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        className="custom-video"
      />
    );
    
    const container = screen.getByAltText('Video').closest('div');
    expect(container).toHaveClass('custom-video');
  });

  it('handles image error', () => {
    render(<VideoIcon src="invalid-url" alt="Video" />);
    
    const image = screen.getByAltText('Video');
    fireEvent.error(image);
    
    // Should show fallback or error state
    expect(image).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video thumbnail"
        aria-label="Click to play video"
      />
    );
    
    const container = screen.getByAltText('Video thumbnail').closest('div');
    expect(container).toHaveAttribute('aria-label', 'Click to play video');
  });

  it('renders with custom play button text', () => {
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        playButtonText="Watch"
      />
    );
    
    const playButton = screen.getByRole('button', { name: /watch/i });
    expect(playButton).toBeInTheDocument();
  });

  it('handles play button click', () => {
    const handlePlay = jest.fn();
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        onPlay={handlePlay}
      />
    );
    
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it('renders with custom aspect ratio', () => {
    render(
      <VideoIcon 
        src="https://example.com/video.jpg" 
        alt="Video" 
        aspectRatio="16/9"
      />
    );
    
    const container = screen.getByAltText('Video').closest('div');
    expect(container).toHaveClass('aspect-video');
  });
});
