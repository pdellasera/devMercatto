import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { Input } from '../Input';
import { Search, Eye } from 'lucide-react';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-neutral-200', 'bg-white');
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Input variant="filled" placeholder="Filled input" />);
    
    let input = screen.getByPlaceholderText('Filled input');
    expect(input).toHaveClass('bg-neutral-50', 'border-0');

    rerender(<Input variant="outlined" placeholder="Outlined input" />);
    input = screen.getByPlaceholderText('Outlined input');
    expect(input).toHaveClass('border-2', 'bg-transparent');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="sm" placeholder="Small input" />);
    
    let input = screen.getByPlaceholderText('Small input');
    expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Input size="lg" placeholder="Large input" />);
    input = screen.getByPlaceholderText('Large input');
    expect(input).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('renders with left icon', () => {
    render(<Input leftIcon={<Search />} placeholder="Search" />);
    
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('pl-10');
    expect(input.parentElement).toHaveClass('relative');
  });

  it('renders with right icon', () => {
    render(<Input rightIcon={<Eye />} placeholder="Password" />);
    
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveClass('pr-10');
  });

  it('shows error message', () => {
    render(<Input error="This field is required" placeholder="Input" />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-error-500');
  });

  it('shows helper text', () => {
    render(<Input helperText="This is helpful information" placeholder="Input" />);
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    expect(screen.getByText('This is helpful information')).toHaveClass('text-neutral-600');
  });

  it('handles input changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Input" />);
    
    const input = screen.getByPlaceholderText('Input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Input" />);
    
    const input = screen.getByPlaceholderText('Input');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Input" />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has proper accessibility attributes', () => {
    render(<Input label="Email" id="email-input" aria-describedby="email-help" />);
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
    expect(input).toHaveAttribute('aria-describedby', 'email-help');
  });
});
