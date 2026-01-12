import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { describe, it, expect } from 'vitest';

describe('Card Component', () => {
    it('renders card with children', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                </CardHeader>
                <CardContent>Content</CardContent>
            </Card>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className to card', () => {
        render(<Card className="custom-card">Card</Card>);
        const card = screen.getByText('Card');
        expect(card).toHaveClass('custom-card');
    });
});
