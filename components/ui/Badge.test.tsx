import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { describe, it, expect } from 'vitest';

describe('Badge Component', () => {
    it('renders with default variant and size', () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText('Default Badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-gray-100');
        expect(badge).toHaveClass('px-2.5');
    });

    it('renders with specific variant', () => {
        render(<Badge variant="success">Success Badge</Badge>);
        const badge = screen.getByText('Success Badge');
        expect(badge).toHaveClass('bg-green-100');
    });

    it('renders with specific size', () => {
        render(<Badge size="lg">Large Badge</Badge>);
        const badge = screen.getByText('Large Badge');
        expect(badge).toHaveClass('px-3');
    });

    it('applies custom className', () => {
        render(<Badge className="custom-style">Styled Badge</Badge>);
        const badge = screen.getByText('Styled Badge');
        expect(badge).toHaveClass('custom-style');
    });
});
