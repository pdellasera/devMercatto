// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { Avatar } from '../Avatar';

describe('Avatar Component', () => {
  it('renders with default props', () => {
    render(<Avatar />);
    
    const avatar = screen.getByText('U').closest('div');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('w-10', 'h-10', 'text-sm');
  });

  it('renders with fallback text', () => {
    render(<Avatar fallback="John Doe" />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders with image', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User avatar" />);
    
    const image = screen.getByAltText('User avatar');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows fallback when image fails to load', () => {
    render(<Avatar src="invalid-url" fallback="John Doe" />);
    
    const image = screen.getByAltText('Avatar');
    fireEvent.error(image);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Avatar size="sm" fallback="Test" />);
    
    let avatar = screen.getByText('T').closest('div');
    expect(avatar).toHaveClass('w-8', 'h-8', 'text-xs');

    rerender(<Avatar size="lg" fallback="Test" />);
    avatar = screen.getByText('T').closest('div');
    expect(avatar).toHaveClass('w-12', 'h-12', 'text-base');

    rerender(<Avatar size="xl" fallback="Test" />);
    avatar = screen.getByText('T').closest('div');
    expect(avatar).toHaveClass('w-16', 'h-16', 'text-lg');
  });

  it('renders with different shapes', () => {
    const { rerender } = render(<Avatar shape="circle" fallback="Test" />);
    
    let avatar = screen.getByText('T').closest('div');
    expect(avatar).toHaveClass('rounded-full');

    rerender(<Avatar shape="square" fallback="Test" />);
    avatar = screen.getByText('T').closest('div');
    expect(avatar).toHaveClass('rounded-lg');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Avatar onClick={handleClick} fallback="Test" />);
    
    const avatar = screen.getByText('T').closest('div');
    fireEvent.click(avatar);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Avatar className="custom-class" fallback="Test" />);
    
    const avatar = screen.getByText('T').closest('div');
    expect(avatar).toHaveClass('custom-class');
  });

  it('generates initials correctly', () => {
    const { rerender } = render(<Avatar fallback="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();

    rerender(<Avatar fallback="Mary Jane Smith" />);
    expect(screen.getByText('MJ')).toBeInTheDocument();

    rerender(<Avatar fallback="A" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User avatar" />);
    
    const image = screen.getByAltText('User avatar');
    expect(image).toHaveAttribute('alt', 'User avatar');
  });
});
