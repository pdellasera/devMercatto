import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { SearchBar } from '../SearchBar';

describe('SearchBar Component', () => {
  it('renders with default props', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('w-full', 'pl-10', 'pr-10');
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar placeholder="Search users..." />);
    
    const input = screen.getByPlaceholderText('Search users...');
    expect(input).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="test" onChange={handleChange} />);
    
    const input = screen.getByDisplayValue('test');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('handles search submission', () => {
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('handles clear action', () => {
    const handleChange = jest.fn();
    const handleClear = jest.fn();
    render(<SearchBar value="test" onChange={handleChange} onClear={handleClear} />);
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(handleClear).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<SearchBar size="sm" />);
    
    let input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveClass('h-8', 'text-sm');

    rerender(<SearchBar size="lg" />);
    input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveClass('h-12', 'text-lg');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<SearchBar variant="default" />);
    
    let input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveClass('border-neutral-200', 'bg-white');

    rerender(<SearchBar variant="filled" />);
    input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveClass('border-0', 'bg-neutral-50');
  });

  it('shows loading state', () => {
    render(<SearchBar loading />);
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeDisabled();
    
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SearchBar className="custom-class" />);
    
    const container = screen.getByPlaceholderText('Search...').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar aria-label="Search prospects" />);
    
    const input = screen.getByLabelText('Search prospects');
    expect(input).toBeInTheDocument();
  });

  it('focuses input when search icon is clicked', () => {
    render(<SearchBar />);
    
    const searchIcon = screen.getByRole('button', { name: /search/i });
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.click(searchIcon);
    expect(input).toHaveFocus();
  });
});
