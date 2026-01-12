import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { describe, it, expect, vi } from 'vitest';

describe('Input Component', () => {
    it('renders with label', () => {
        render(<Input label="Username" id="username" />);
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('handles value changes', () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');
        fireEvent.change(input, { target: { value: 'hello' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('shows error message', () => {
        render(<Input error="Invalid input" />);
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveClass('border-red-300');
    });

    it('renders as textarea when multiline is true', () => {
        render(<Input multiline placeholder="Enter long text" />);
        expect(screen.getByPlaceholderText('Enter long text').tagName).toBe('TEXTAREA');
    });

    it('renders icon when provided', () => {
        const Icon = () => <span data-testid="test-icon">icon</span>;
        render(<Input icon={<Icon />} />);
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
});
