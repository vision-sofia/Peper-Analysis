'''
Install selenium and pandas using pip
Install PhantomJS or get Chrome- or Firefox webdriver binaries and add them to your PATH (see http://selenium-python.readthedocs.io/installation.html#drivers)
        
        python tripadvisior.py -e firefox -n 10 -o my_reviews.csv https://www.tripadvisor.com/Restaurants-g294452-Sofia_Sofia_Region.html
'''
import argparse
import datetime
import locale
import logging
import re
import sys
import time

import pandas as pd
from selenium import webdriver

URL_PATTERN = 'http(s)?:\/\/.?(www\.)?tripadvisor\.(com|de)\/Restaurant.*'

class Review():
    def __init__(self, id, date, name, score, lat, lng, title, user, text):
        self.id = id
        self.date = date
        self.name = name
        self.score = score
        self.lat = lat
        self.lng = lng
        self.title = title
        self.user = user
        self.text = text


class TripadvisorScraper():
    def __init__(self, engine='phantomjs'):
        self.language = 'en'
        self.locale_backup = locale.getlocale()[0]
        self.lookup = {}

        if engine == 'chrome':
            self.driver = webdriver.Chrome()
        elif engine == 'firefox':
            self.driver = webdriver.Firefox()
        elif engine == 'phantomjs':
            self.driver = webdriver.PhantomJS()
        else:
            logging.warning('Engine {} not supported. Defaulting to PhantomJS.'.format(engine))
            self.driver = webdriver.PhantomJS()

        self.i18n = {
            'en': {
                'more_btn': 'More',
                'date_format': '%B %d, %Y'
            },
            'de': {
                'more_btn': 'Mehr',
                'date_format': '%d. %B %Y'
            }
        }

    def _parse_page(self):
        reviews = []
        name = self.driver.find_element_by_id('HEADING').text.replace('\n', '')
        score = 100 * float(self.driver.find_element_by_class_name("ui_bubble_rating").get_attribute("content")) / 5
        lat = self.driver.execute_script("return window.map0Div.lat")
        lng = self.driver.execute_script("return window.map0Div.lng")
        try:
            self.driver.find_element_by_xpath('//span[contains(., "{}") and @class="taLnk ulBlueLinks"]'.format(self.i18n[self.language]['more_btn'])).click()
        except:
            pass

        time.sleep(1)

        review_elements = self.driver.find_elements_by_class_name('reviewSelector')
        for e in review_elements:
            try:
                id = e.get_attribute('id')
                date = e.find_element_by_class_name('ratingDate').get_attribute('title')
                date = datetime.datetime.strptime(date, self.i18n[self.language]['date_format'])
                title = e.find_element_by_class_name('quote').find_element_by_tag_name('a').find_element_by_class_name('noQuotes').text
                try:
                    user = e.find_element_by_class_name('memberOverlayLink').get_attribute('id')
                    user = user[4:user.index('-')]
                except:
                    user = None
                text = e.find_element_by_class_name('partial_entry').text.replace('\n', '')
                if id in self.lookup:
                    logging.warning('Fetched review {} twice.'.format(r.id))
                else:
                    self.lookup[id] = True
                    reviews.append(Review(id, date, name, score, lat, lng, title, user, text))
            except:
                logging.warning('Couldn\'t fetch review.')
                pass

        return reviews

    def _set_language(self, url=''):
        if 'tripadvisor.de' in url:
            self.language = 'de'
            # locale.setlocale(locale.LC_TIME, 'de_DE')
        elif 'tripadvisor.com' in url:
            self.language = 'en'
            # locale.setlocale(locale.LC_TIME, 'en_US.UTF-8')
        else:
            logging.warn('Tripadvisor domain location not supported. Defaulting to English (.com)')

    def get_urls(self, url, max_urls=None):
        urls = []
        if not max_urls: max_urls = sys.maxsize

        if not is_valid_url(url): return logging.warning('Tripadvisor URL not valid.')
        self.driver.get(url)

        time.sleep(1)
 
        while len(urls) < max_urls:
            time.sleep(1)
            url_elements = self.driver.find_elements_by_class_name('property_title')
            for e in url_elements:
                href = e.get_attribute('href')
                if href:
                    urls.append(href)

            next_button_container = self.driver.find_element_by_class_name('next')
            if 'disabled' in next_button_container.get_attribute('class'): break
            next_button_container.click()

        return urls

    def fetch_reviews(self, url, max_reviews=None, as_dataframe=True):
        self.lookup = {}
        reviews = []
        if not max_reviews: max_reviews = sys.maxsize
        self._set_language(url)

        if not is_valid_url(url): return logging.warning('Tripadvisor URL not valid.')
        self.driver.get(url)

        time.sleep(2)

        while len(reviews) < max_reviews:
            reviews += self._parse_page()
            logging.info('Fetched a total of {} reviews by now.'.format(len(reviews)))
            next_button_container = self.driver.find_element_by_class_name('next')
            if 'disabled' in next_button_container.get_attribute('class'): break
            next_button_container.click()

        locale.setlocale(locale.LC_TIME, self.locale_backup)
        # reviews = reviews[:max_reviews]
        if as_dataframe: return pd.DataFrame.from_records([r.__dict__ for r in reviews]).set_index('id', drop=True)
        return reviews

    def close(self):
        self.driver.quit()

def is_valid_url(url):
    return re.compile(URL_PATTERN).match(url)

def get_language_by_url(url):
    if 'tripadvisor.de' in url: return 'de'
    elif 'tripadvisor.com' in url: return 'en'
    return None

def get_id_by_url(url):
    if not is_valid_url(url): return None
    match = re.compile('.*Restaurant_Review-g\d+-(d\d+).*').match(url)
    if match is None: return None
    return match.group(1)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Scrape restaurant reviews from Tripadvisor (.com or .de).')
    parser.add_argument('url', help='URL to a Tripadvisor restaurant page')
    parser.add_argument('-o', '--out', dest='outfile', help='Path for output CSV file', default='reviews.csv')
    parser.add_argument('-n', dest='max', help='Maximum number of reviews to fetch', default=sys.maxsize, type=int)
    parser.add_argument('-e', '--engine', dest='engine', help='Driver to use', choices=['phantomjs', 'chrome', 'firefox'], default='phantomjs')
    args = parser.parse_args()

    scraper = TripadvisorScraper(engine=args.engine)
    urls = scraper.get_urls(args.url, 1)
    dfs = []
    for url in urls:
        dfs.append(scraper.fetch_reviews(url, 1)) #args.max
        # print('Successfully fetched {} reviews.'.format(len(dfs[-1].index)))

    dfs = pd.concat(dfs)
    dfs.to_csv(args.outfile)
    scraper.close()