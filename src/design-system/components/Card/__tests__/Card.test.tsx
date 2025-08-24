import React from 'react';
import { render, screen } from '../../../../test-utils/test-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card Component', () => {
  it('renders card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Test content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('applies custom className to Card', () => {
    render(<Card className="custom-class">Content</Card>);
    
    const card = screen.getByText('Content').closest('[class*="rounded-md"]');
    expect(card).toHaveClass('custom-class');
  });

  it('has proper semantic structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByText('Content').closest('[class*="rounded-md"]');
    expect(card).toHaveClass('rounded-md', 'border', 'bg-white', 'shadow-card');
  });

  it('renders CardHeader with proper styling', () => {
    render(
      <Card>
        <CardHeader className="custom-header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const header = screen.getByText('Title').parentElement;
    expect(header).toHaveClass('custom-header', 'flex', 'flex-col', 'space-y-1.5', 'pb-4');
  });

  it('renders CardTitle with proper styling', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle className="custom-title">Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const title = screen.getByText('Title');
    expect(title).toHaveClass('custom-title', 'text-lg', 'font-semibold', 'text-neutral-900');
  });

  it('renders CardDescription with proper styling', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription className="custom-description">Description</CardDescription>
        </CardHeader>
      </Card>
    );

    const description = screen.getByText('Description');
    expect(description).toHaveClass('custom-description', 'text-sm', 'text-neutral-600');
  });

  it('renders CardContent with proper styling', () => {
    render(
      <Card>
        <CardContent className="custom-content">
          <p>Content</p>
        </CardContent>
      </Card>
    );

    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('custom-content', 'pt-0');
  });

  it('renders CardFooter with proper styling', () => {
    render(
      <Card>
        <CardFooter className="custom-footer">
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    const footer = screen.getByRole('button', { name: /action/i }).parentElement;
    expect(footer).toHaveClass('custom-footer', 'flex', 'items-center', 'pt-4');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Test</Card>);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('handles empty content gracefully', () => {
    render(<Card />);
    
    const card = document.querySelector('[class*="rounded-md"]');
    expect(card).toBeInTheDocument();
  });
});
