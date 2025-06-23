import { expect, type Locator, type Page } from '@playwright/test';
import { homeMapping } from './home.mapping';



export class HomePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForSelector(homeMapping.acceptAllButton, { state: 'visible' });
        await this.page.click(homeMapping.acceptAllButton);
    }

    // In your HomePage class
    async selectCurrency(currencyToUpdate: string): Promise<void> {
        await this.page.getByText(homeMapping.currencySelector).click();
        await this.page.getByText(homeMapping.currencyMap[currencyToUpdate]).click();
    }

    async searchYourDestination(destination: string): Promise<Page> {
        await this.page.getByPlaceholder(homeMapping.destinationSelector).fill(destination);
        await this.page.getByRole('option', { name: homeMapping.destinationMap[destination] }).click();
        await this.page.getByText('Why a BetterRoaming eSIM for').scrollIntoViewIfNeeded();

        return this.page;
    }
}