class Stepper {
    marginCount = 0;
    fullWidth = 100;
    progressBar = null;
    progressPoints = null;
    progressClassname = "current";
    pageCount = 0;
    pagesWrapperWidth = 0;
    constructor(pagesWrapper, pageCount, progressBar) {
        this.pagesWrapper = pagesWrapper ? pagesWrapper : null;
        this.pageCount = pageCount;
        this.pagesWrapperWidth = this.pageCount * (this.fullWidth);
        this.maxPages = this.pageCount ? ((this.pagesWrapperWidth) - (this.fullWidth)) : null;
        pagesWrapper?.parentElement.classList.add("show");
        this.progressBar = progressBar;
        this.progressPoints = this.progressBar?.children;
    }


    stepForward() {
        if (this.marginCount != -this.maxPages) {
            (this.marginCount) -= (this.fullWidth);
            if (this.pagesWrapper) { this.pagesWrapper.style.marginLeft = this.marginCount + "% " };
            this.updateProgress(this.marginCount);
        }
    }
    stepBackward() {
        if (this.marginCount < 0) {
            this.marginCount = this.marginCount + (this.fullWidth)
            if (this.pagesWrapper) {
                this.pagesWrapper.style.marginLeft = this.marginCount + "% ";
            }
            this.updateProgress(this.marginCount);
        }
    }


    updateProgress(marginCount) {
        let pagesWidthNotPassed = this.pagesWrapperWidth + marginCount;
        let numberOfScreensNotPassed = pagesWidthNotPassed / (this.fullWidth);
        let currentScreenNumber = (this.pageCount + 1) - numberOfScreensNotPassed;

        for (let i = 0; i < this.progressPoints.length; i++) {
            const element = this.progressPoints[i];
            element.classList.remove(this.progressClassname);
        }
        for (let i = 0; i < this.progressPoints.length; i++) {
            const element = this.progressPoints[i];
            element.classList.remove("passed");
        }
        for (let i = 0; i < currentScreenNumber; i++) {
            const element = this.progressPoints[i];
            element?.classList.add(this.progressClassname)
        }
        for (let i = 0; i < (currentScreenNumber - 1); i++) {
            const element = this.progressPoints[i];
            element?.classList.add("passed")
        }
    }
}

export default Stepper;