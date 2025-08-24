import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { MetricBadge } from '../MetricBadge';

describe('MetricBadge Component', () => {
  it('renders with default props', () => {
    render(<MetricBadge label="Total Users" value="1,234" />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<MetricBadge label="Revenue" value="$50,000" icon="💰" />);
    
    expect(screen.getByText('💰')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with trend indicator up', () => {
    render(<MetricBadge label="Growth" value="+15%" trend="up" />);
    
    const trendIcon = screen.getByTestId('trend-up');
    expect(trendIcon).toBeInTheDocument();
    expect(trendIcon).toHaveClass('text-success-500');
  });

  it('renders with trend indicator down', () => {
    render(<MetricBadge label="Decline" value="-8%" trend="down" />);
    
    const trendIcon = screen.getByTestId('trend-down');
    expect(trendIcon).toBeInTheDocument();
    expect(trendIcon).toHaveClass('text-error-500');
  });

  it('renders with trend indicator neutral', () => {
    render(<MetricBadge label="Stable" value="0%" trend="neutral" />);
    
    const trendIcon = screen.getByTestId('trend-neutral');
    expect(trendIcon).toBeInTheDocument();
    expect(trendIcon).toHaveClass('text-neutral-500');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<MetricBadge label="Test" value="100" variant="default" />);
    
    let badge = screen.getByText('Test').closest('div');
    expect(badge).toHaveClass('bg-white', 'border-neutral-200');

    rerender(<MetricBadge label="Test" value="100" variant="primary" />);
    badge = screen.getByText('Test').closest('div');
    expect(badge).toHaveClass('bg-primary-50', 'border-primary-200');

    rerender(<MetricBadge label="Test" value="100" variant="success" />);
    badge = screen.getByText('Test').closest('div');
    expect(badge).toHaveClass('bg-success-50', 'border-success-200');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<MetricBadge label="Test" value="100" size="sm" />);
    
    let badge = screen.getByText('Test').closest('div');
    expect(badge).toHaveClass('p-3');

    rerender(<MetricBadge label="Test" value="100" size="lg" />);
    badge = screen.getByText('Test').closest('div');
    expect(badge).toHaveClass('p-6');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MetricBadge label="Clickable" value="100" onClick={handleClick} />);
    
    const badge = screen.getByText('Clickable').closest('div');
    fireEvent.click(badge);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<MetricBadge label="Test" value="100" className="custom-badge" />);
    
    const badge = screen.getByText('Test').closest('div');
    expect(badge).toHaveClass('custom-badge');
  });

  it('renders with custom value formatting', () => {
    render(
      <MetricBadge 
        label="Percentage" 
        value="85.5" 
        valueSuffix="%" 
        valuePrefix="~"
      />
    );
    
    expect(screen.getByText('~85.5%')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <MetricBadge 
        label="Active Users" 
        value="1,234" 
        description="Last 30 days"
      />
    );
    
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <MetricBadge 
        label="Metric" 
        value="100" 
        role="button"
        aria-label="Click to view details"
      />
    );
    
    const badge = screen.getByText('Metric').closest('div');
    expect(badge).toHaveAttribute('role', 'button');
    expect(badge).toHaveAttribute('aria-label', 'Click to view details');
  });

  it('renders with loading state', () => {
    render(<MetricBadge label="Loading" value="..." loading />);
    
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
  });
});
