import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { Table } from '../Table';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];

const mockColumns = [
  { key: 'name', label: 'Name', sortable: true, accessor: (item: any) => item.name },
  { key: 'email', label: 'Email', sortable: true, accessor: (item: any) => item.email },
  { key: 'status', label: 'Status', sortable: false, accessor: (item: any) => item.status },
];

describe('Table Component', () => {
  it('renders with data and columns', () => {
    render(<Table data={mockData} columns={mockColumns} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<Table data={[]} columns={mockColumns} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<Table data={[]} columns={mockColumns} emptyMessage="No users found" />);
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('handles sorting', () => {
    const handleSort = jest.fn();
    render(<Table data={mockData} columns={mockColumns} onSort={handleSort} />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    expect(handleSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('handles row selection', () => {
    const handleSelectionChange = jest.fn();
    render(
      <Table 
        data={mockData} 
        columns={mockColumns} 
        selectable 
        onSelectionChange={handleSelectionChange}
      />
    );
    
    const checkbox = screen.getAllByRole('checkbox')[1]; // First data row checkbox
    fireEvent.click(checkbox);
    
    expect(handleSelectionChange).toHaveBeenCalledWith([1]);
  });

  it('handles pagination', () => {
    const handlePageChange = jest.fn();
    render(
      <Table 
        data={mockData} 
        columns={mockColumns} 
        pagination={{
          page: 1,
          totalPages: 3,
          total: 30,
          limit: 10,
        }}
        onPageChange={handlePageChange}
      />
    );
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('shows loading state', () => {
    render(<Table data={mockData} columns={mockColumns} loading />);
    
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders with custom row key', () => {
    render(<Table data={mockData} columns={mockColumns} rowKey="email" />);
    
    // Should render without errors
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Table data={mockData} columns={mockColumns} className="custom-table" />);
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-table');
  });

  it('renders sort indicators', () => {
    render(
      <Table 
        data={mockData} 
        columns={mockColumns} 
        sortColumn="name"
        sortDirection="asc"
      />
    );
    
    const nameHeader = screen.getByText('Name');
    expect(nameHeader).toHaveClass('text-primary-600');
  });

  it('handles row click', () => {
    const handleRowClick = jest.fn();
    render(
      <Table 
        data={mockData} 
        columns={mockColumns} 
        onRowClick={handleRowClick}
      />
    );
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow);
    
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
  });
});
